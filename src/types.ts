export interface Task{
    id: number
    name: string
    description: string
    completed: boolean
    categoryId: number
}

export interface Category{
    id: number
    name: string
    image: string
}