import { FormEvent, useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";

import { FcGoogle } from 'react-icons/fc';
import { FaExclamationTriangle, FaGithub } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SignInFlow } from '../types';


interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const { signIn } = useAuthActions();

    const onPasswordSignUp = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setPending(true);

        signIn("password", { name, email, password, flow: "signUp" })
            .catch(() => {
                setError("Something went wrong");
            })
            .finally(() => {
                setPending(false);
            });
    };

    const onProviderSignUp = (value: "github" | "google") => {
        setPending(true);
        signIn(value)
            .finally(() => {
                setPending(false);
            });
    }


    return (
        <Card className='w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                    Sign up to continue
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue.
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <FaExclamationTriangle className="size-4 " />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className='space-y-5 px-0 pb-0'>
                <form onSubmit={onPasswordSignUp} className='space-y-2.5'>
                    <Input

                        placeholder='Full Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={pending}
                        required
                    />
                    <Input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={pending}
                        required
                    />
                    <Input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={pending}
                        required
                    />
                    <Input
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={pending}
                        required
                    />
                    <Button type='submit' className='w-full' size={'lg'} disabled={pending}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className='flex flex-col gap-y-2.5'>
                    <Button
                        className='w-full relative'
                        size={'lg'}
                        disabled={pending}
                        onClick={() => onProviderSignUp('google')}
                        variant={'outline'}
                    >
                        <FcGoogle className='size-5 absolute top-3 left-2.5' />
                        Continue with Google
                    </Button>

                    <Button
                        className='w-full relative'
                        size={'lg'}
                        disabled={pending}
                        onClick={() => onProviderSignUp('github')}
                        variant={'outline'}
                    >
                        <FaGithub className='size-5 absolute top-3 left-2.5' />
                        Continue with GitHub
                    </Button>
                </div>
                <p className='text-xs text-muted-foreground font-semibold'>
                    Already have an account? <span onClick={() => setState("signIn")} className='text-sky-700 hover:underline cursor-pointer'>Login</span>
                </p>
            </CardContent>
        </Card>
    )
};