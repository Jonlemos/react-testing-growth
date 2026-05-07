import { redirect } from "next/navigation";

const LogoutPage = async () => {
    redirect('/login');
}

export default LogoutPage