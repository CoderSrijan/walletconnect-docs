import { useState, useRef, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import s from './styles.module.css'
import { parseEnvironment, setItemInStorage } from './utils'
import { env_icons } from './icons'

/**
 * This Dropdown Menu is meant to be for a list of Frameworks and Programming languages.
 *  The selected item will mutate the current URL
 */
export default function Dropdown({ list, initial }) {
  const location = useLocation()
  const history = useHistory()

  const [selected, setSelected] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  if (!selected) {
    if (initial) {
      setSelected(initial)
    } else {
      const environment = list.find(item => location.pathname.includes(item))
      if (!environment) {
        throw Error("The current path doesn't contain any environment.")
      }
      setSelected(environment)
    }
  }

  function handleItem(new_environment) {
    const current_environment = list.find(item => location.pathname.includes(item))
    if (!current_environment) {
      throw Error("The current path doesn't contain any environment.")
    }
    setSelected(new_environment)
    setIsOpen(false)
    setItemInStorage(new_environment)
    const new_path =
      location.pathname.slice(0, location.pathname.indexOf(current_environment)) +
      new_environment +
      '/core/installation'

    history.push(new_path)
  }

  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  const toggleIconRef = useRef(null)

  useEffect(()=>{
    if(isOpen){
      toggleIconRef.current.style.transform = "rotate(180deg)"
    }else{
      toggleIconRef.current.style.transform = "rotate(90deg)"
    }
  },[isOpen, toggleIconRef])

  return (
    <div className={s.container} ref={menuRef}>
      <div className={s.dropdownButton} onClick={() => setIsOpen(p => !p)}>
        <img className={s.envIcon} src={env_icons[selected]} alt={selected} />
        {parseEnvironment(selected)}
        <span className={s.dropdownIcon} ref={toggleIconRef} />
      </div>
      {isOpen && <div className={s.dropdownContainer}>
        {list
          .filter(i => i !== selected)
          .map(item => (
            <span className={s.item} onClick={() => handleItem(item)}>
              <img className={s.envIcon} src={env_icons[item]} alt={item} />
              {parseEnvironment(item)}
            </span>
          ))}
      </div>}
    </div>
  )
}