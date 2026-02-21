# VisualProgramming
These are storage spaces for visual programming projects
# LAB1
interfaces User;  
functions User() - create new User;  
interfaces Book;  
function createBook(book: Book) - create new book;  
function calculateArea(shape: 'circle'| 'square', value: number) - calculate area for circle or square;  
function getStatusColor(status: Status) - set color for user status;  
const capitalFirst: StringFormatter = (value, uppercase = false) - formating string;  
function findById<T extends Hasid>(items: T[], id: number) - search user by id;  
