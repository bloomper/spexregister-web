'use client';
import {Session} from 'next-auth';
import SignIn from './sign-in';
import SignOut from './sign-out';

export interface HeaderProps {
    session?: Session | null;
}

export function Header({session}: HeaderProps) {
    return (
        <header className="bg-gray-800 text-white p-4 flex flex-row justify-between items-center">
            <h1>NextJS KC</h1>
            {session?.user ? (
                <div className="flex flex-row justify-between items-center">
                    <div className="mr-4">{session.user.name}</div>
                    <SignOut name={session.user.name ?? ''}/>
                </div>
            ) : (
                <SignIn/>
            )}
        </header>
    );
}