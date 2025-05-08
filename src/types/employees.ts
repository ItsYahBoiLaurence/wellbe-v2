export type LoginCreds = {
  email: string
  first_name: string
  last_name: string
  department_name: string
  company: string
  password: string
}


export type UserDetials = {
  id: number
  first_name: string
  last_name: string
  email: string
  department_id: number
  department: {
    name: string
    company: {
      name: string
    }
  }
}