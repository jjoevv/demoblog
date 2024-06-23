import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

export const DropdownSort = ({ onSelect }) => {
  const {t} = useTranslation()
  const [selectedOption, setSelectedOption] = useState('random');
  const options = ["random", "followed", "upcoming", "nameAz", "latest"]
  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };
  return (
    <Dropdown>
      <Dropdown.Toggle className='bg-transparent border-primary-normal text-dropdown-toggle'>
        <span className='fw-semibold'>{t('sort_by')}:</span> {`  ${t(selectedOption)}` || 'Random'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {
          options
          &&
          <>
            {options.map(option => (
              <Dropdown.Item key={option} onClick={() => handleSelect(option)}>
                {t(option)}
              </Dropdown.Item>
            ))}
          </>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}
