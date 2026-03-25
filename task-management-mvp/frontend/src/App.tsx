import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import { TaskProvider } from "./context/TaskContext";
import { router } from "./router";

const App = () => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <TaskProvider>
          <RouterProvider router={router} />
        </TaskProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};

export default App;
