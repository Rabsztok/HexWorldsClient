import React from 'react'
import styles from './bottom_navigation.scss'

const BottomNavigation = ({children}) =>
    <div className={styles['bottom-navigation']}>
      {children}
    </div>


export default BottomNavigation