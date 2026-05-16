import Navegation from "./Header"
import Tasks from "../pages/tasks/GetTasks"

export default function HomePage() {

    return (
        <div className="flex flex-col">
          <Navegation/>
            <Tasks/>
        </div>
    )
}