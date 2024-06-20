
import { faFileImport } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button} from "react-bootstrap"
import useImport from "../../../hooks/useImport"
import ModalImport from "./ModalImport"

const ImportButton = () => {
    const {showOptionImportModal, setOptionShowImportModal, } = useImport()

  return (
    <div>
        <Button 
        title="Import data to dashboard"
        onClick={()=>setOptionShowImportModal(true)}
        className="bg-white border-0 bg-white text-color-black fw-medium d-flex align-items-center border border-0">
            <FontAwesomeIcon icon={faFileImport} className='me-2'/>
            Import file
           
        </Button>
      {showOptionImportModal &&  <ModalImport show={showOptionImportModal} onHide={()=>setOptionShowImportModal(false)}/>}
      
    </div>
  )
}

export default ImportButton