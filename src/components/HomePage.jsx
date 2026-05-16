import Navegation from "./Header"
import Tasks from "../pages/tasks/GetTasks"
import FilterTasks from "./FilterTasks"

export default function HomePage() {

    return (
        <div className="flex flex-col">
          <Navegation/>
            <FilterTasks/>
            <Tasks/>
        </div>
    )
}