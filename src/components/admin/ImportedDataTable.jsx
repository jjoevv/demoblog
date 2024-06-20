import { useEffect, useState } from 'react'
import useImport from '../../hooks/useImport'
import { Button, Carousel, Form, Spinner, Table } from 'react-bootstrap'
import forcode from './../../data/forcode.json'
import useAdmin from '../../hooks/useAdmin'
import ReactPaginate from 'react-paginate'
const ImportedDataTable = ({ onHide }) => {
    const { getAllPendingConferences } = useAdmin()
    const { dataUpload, setShowImportModal, handleImport } = useImport()
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const headersNames = ['None', 'Name', 'Acronym', 'Source', 'Rank', 'Field of Research'];
    const [activePage, setActivePage] = useState(0);
    const [warningMessage, setWarningMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [isImported, setIsimported] = useState(false)
    const [formatedData, setFormatedData] = useState([])
    const [formatedHeaders, setFormatedHeaders] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageFormatted, setCurrentPageFormatted] = useState(0);
    const [displayedData, setDisplayedData] = useState(dataUpload.data);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handlePageClickFormatted = (event) => {
        setCurrentPageFormatted(event.selected);
    };
    const ITEMS_PER_PAGE = 6


    useEffect(() => {
        setActivePage(0); // Reset active page when data changes
    }, [dataUpload]);

    const handleNext = () => {
        let isFailed = false;
        let newWarningMessage = '';
    
        // Kiểm tra xem selectedHeaders có chứa tất cả các header bắt buộc không
        const requiredHeaders = ['Name', 'Acronym', 'Source', 'Rank', 'Field of Research'];
        const isMissingHeader = requiredHeaders.some(headerName => {
            return !selectedHeaders.some(header => header !== undefined && header.name === headerName);
        });
    
        if (selectedHeaders.length !== 0 && !isMissingHeader) {
            const selectedCol = selectedHeaders.filter(header => header !== undefined && header.name !== 'None');
            const newData = dataUpload.data.map(row => {
                let newRow = [];
                selectedHeaders.forEach(header => {
                    if (header && header.name === 'Field of Research') {
                        const fieldOfResearchCodes = row.filter((value, index) => selectedHeaders.some(h => h && h.order === index && h.name === 'Field of Research'));
                        const fieldOfResearchNames = fieldOfResearchCodes.map(code => {
                            if (code !== '') {
                                const mapping = forcode.find(mapping => mapping.code === code);
                                if (mapping) {
                                    return mapping.code;
                                } else {
                                    newWarningMessage = `Please check the selected FOR column has code '${code}'. Code is not utilized in research fields.`;
                                    isFailed = true;
                                    return ''; // or another value when mapping not found
                                }
                            }
                        });
                        newRow.push(fieldOfResearchNames.join('; '));
                    } else {
                        if (header && header.name !== 'None') {
                            newRow.push(row[header.order]);
                        }
                    }
                });
    
                // Validate 'Source' column
                const sourceIndex = selectedHeaders.findIndex(header => header && header?.name === 'Source');
                if (sourceIndex !== -1 && !/CORE20/.test(row[sourceIndex])) {
                    newWarningMessage = 'The Source column is wrong';
                    isFailed = true;
                }
    
                // Validate 'Acronym' column
                const acronymIndex = selectedHeaders.findIndex(header => header && header.name === 'Acronym');
                if (acronymIndex !== -1 && row[acronymIndex].length >= 20) {
                    newWarningMessage = 'The Acronym column is wrong';
                    isFailed = true;
                }
    
                return newRow;
            });
    
            const uniqueColumnNames = [...new Set(selectedCol.map(header => header.name))];
            const uniqueData = newData.map(list => {
                const uniqueSet = new Set();
                list.forEach(item => {
                    const trimmedItem = item.trim();
                    if (trimmedItem !== "" && !uniqueSet.has(trimmedItem)) {
                        uniqueSet.add(trimmedItem);
                    }
                });
                return Array.from(uniqueSet);
            });
    
            setFormatedHeaders(Array.from(uniqueColumnNames));
            setFormatedData(uniqueData);
    
            if (!isFailed && warningMessage === '') {
                setActivePage(activePage + 1);
            } else {
                setWarningMessage(newWarningMessage);
                setTimeout(() => {
                    setWarningMessage('');
                }, 5000);
            }
        } else {
            setWarningMessage('You should select columns for Name, Acronym, Source, Rank, Field of Research');
            setTimeout(() => {
                setWarningMessage('');
            }, 5000);
        }
    };
    


    const handleSelectHeader = (selectedHeader, index) => {
        const newSelectedColumns = [...selectedHeaders];
        newSelectedColumns[index] = { order: index, name: selectedHeader };
        setSelectedHeaders(newSelectedColumns);
    };
    const handleImportFile = async () => {
        setLoading(true)
        setIsimported(true)
        const res = await handleImport(formatedData, formatedHeaders)
        setStatus(res.status)
        setWarningMessage(res.message)
        setLoading(false)
        if (res.status) {
            getAllPendingConferences()
            setTimeout(() => {
                setWarningMessage('');
                onHide()
            }, 3000);
        }
        setTimeout(() => {
            setWarningMessage('');
        }, 3000);
    }


    const convertCodesToNames = (codes) => {
        return codes.split(';').map(code => {
            const mapping = forcode.find(forMap => forMap.code.toString().trim() === code.trim());
            return mapping ? mapping.for : code;
        }).join('; ');
    };
    const renderTableHeader = (headersName, isSelect) => {
        return (
            <tr>
                {headersName.map((header, index) => (
                    <th key={index}>
                        {
                            isSelect ?
                                <Form.Select
                                    value={selectedHeaders[index]?.name || ''}
                                    onChange={(e) => handleSelectHeader(e.target.value, index)}
                                >
                                    <option value="" disabled>Select Header</option>
                                    {headersNames.map((name, i) => (
                                        <option
                                            key={i}
                                            value={name}
                                            disabled={selectedHeaders.some(column => column?.name === name && name !== 'Field of Research' && name !== 'None')}
                                        >
                                            {name}
                                        </option>
                                    ))}
                                </Form.Select>
                                :
                                <div>
                                    {header}
                                </div>
                        }
                    </th>
                ))}
            </tr>
        );
    };
    const renderTableBody = (tableData) => {
        // Sắp xếp các hàng dựa trên số lượng cột không rỗng
        const sortedTableData = [...tableData].sort((a, b) => {
            const nonEmptyCountA = a.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
            const nonEmptyCountB = b.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
            return nonEmptyCountB - nonEmptyCountA;
        });

        // Tìm số cột tối đa trong dữ liệu
        const maxColumns = Math.max(...sortedTableData.map(row => row.length));

        // Render các hàng
        return sortedTableData.map((row, rowIndex) => {
            // Tạo hàng mới với các giá trị tương ứng với thứ tự các cột đã chọn
            const renderRow = [...row];

            // Nếu hàng chưa đủ số lượng cột, thêm các ô trống
            while (renderRow.length < maxColumns) {
                renderRow.push('');
            }


            return (
                <tr key={rowIndex}>
                    {renderRow.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`} className=''>
                            {typeof cell === 'string' && cell.includes(';') ? convertCodesToNames(cell) : cell}
                        </td>
                    ))}
                </tr>
            );
        });
    };


    return (
        <div>
            <Carousel activeIndex={activePage} onSelect={() => { }} controls={false} interval={null} indicators={false}>

                <Carousel.Item key={1}>
                <Table striped bordered hover responsive>
                        <thead>
                            {renderTableHeader(dataUpload.headers, true)}
                        </thead>
                        <tbody>
                            {renderTableBody(displayedData, currentPage)}
                        </tbody>
                    </Table>
                    <ReactPaginate
                         nextLabel=">"
                        previousLabel="<"
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(displayedData.length / ITEMS_PER_PAGE)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                        
                </Carousel.Item>
                <Carousel.Item key={2}>
                <Table striped bordered hover responsive>
                        <thead>
                            {renderTableHeader(formatedHeaders, false)}
                        </thead>
                        <tbody>
                            {renderTableBody(formatedData, currentPageFormatted)}
                        </tbody>
                    </Table>
                    <ReactPaginate
                         nextLabel=">"
                        previousLabel="<"
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(formatedData.length / ITEMS_PER_PAGE)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClickFormatted}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        breakLinkClassName="page-link"
                    />
                </Carousel.Item>

            </Carousel>

            <div className="d-flex w-100 justify-content-end align-items-center">
                {!isImported && warningMessage !== '' && (
                    <div className="text-warning">
                        {warningMessage}
                    </div>)
                }
                {
                    isImported && status && warningMessage !== '' &&
                    <div className="text-success">
                        {warningMessage}
                    </div>
                }
                {
                    isImported && !status && warningMessage !== '' &&
                    <div className="text-danger ">
                        {warningMessage}
                    </div>
                }

                <Button
                    disable={activePage === 0 ? true : false}
                    onClick={() => setActivePage(0)}
                    className='bg-secondary text-white mx-2 px-4 border-light'
                >
                    Back
                </Button>
                {
                    activePage === 1 ?
                        <Button
                            className='bg-primary-normal text-white mx-2 px-4 border-light'
                            onClick={handleImportFile}>
                            {
                                loading ?
                                    <Spinner size='sm' />
                                    :
                                    'Import'
                            }
                        </Button>
                        :
                        <Button
                            className='bg-primary-normal text-white mx-2 px-4 border-light'
                            onClick={handleNext}>Next</Button>
                }
            </div>
        </div>
    );
}

export default ImportedDataTable