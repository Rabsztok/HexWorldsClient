import React from 'react'

import styles from 'styles/bottom_navigation.module.scss'

const BottomNavigation: React.FunctionComponent = ({ children }) => (
  <div className={styles['bottom-navigation']}>{children}</div>
)

export default BottomNavigation
