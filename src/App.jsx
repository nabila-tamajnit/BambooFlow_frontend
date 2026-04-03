import { Outlet } from "react-router"
import { Footer } from "./layout/components/Footer"
import { Header } from "./layout/components/Header"

function App() {
 

  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>
      
      <Footer />
    </>
  )
}

export default App
