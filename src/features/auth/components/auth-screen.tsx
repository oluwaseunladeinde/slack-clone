"use client";

import React, { useState } from 'react'
import { SignInFlow } from '../types';
import { SignInCard } from './signin-card';
import { SignUpCard } from './signup-card';

export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn");
    return (
        <div className='h-full flex items-center justify-center bg-[#5C3B58]'>
            <div className='mdbu:h-auto md:w-[420px]'>
                {state === 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
            </div>
        </div>
    )
};