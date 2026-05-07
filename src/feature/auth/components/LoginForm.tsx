'use client'

import { useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/form/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../hooks/useAuth"

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

type LoginFormData = z.infer<typeof formSchema>

export const FormLogin = () => {
  const { login, isLoggingIn, loginError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  const handleSubmit = (data: LoginFormData) => {
    login(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full min-w-[300px]">
        {loginError && (
          <p className="text-sm text-destructive text-center">
            {loginError.message ?? "Credenciais inválidas"}
          </p>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary-foreground">Email</FormLabel>
              <FormControl>
                <Input className="bg-primary-foreground" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-secondary-foreground">Senha</FormLabel>
              <FormControl>
                <Input type="password" className="bg-primary-foreground" placeholder="Sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoggingIn} className="w-full">
          {isLoggingIn ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  )
}
