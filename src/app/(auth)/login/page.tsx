'use client'

import { FormLogin } from "@/feature/auth/components/LoginForm"

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-6 bg-secondary rounded-xl p-10 shadow-2xl">
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-2xl font-semibold text-primary-foreground">
                        Bem-vindo
                    </h1>
                    <p className="text-sm text-primary-foreground">
                        Acesse sua conta para continuar
                    </p>
                </div>
                <FormLogin />
            </div>
        </div>
    )
}

export default LoginPage