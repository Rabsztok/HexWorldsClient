const routes: any = {
  root: () => '/',
  worlds: () => '/',
  debug: () => '/debug',
  world: (id: string) => `/world/${id}`
}

export default routes
