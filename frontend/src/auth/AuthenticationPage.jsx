import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export function AuthenticationPage() {
    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/20 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/20 rounded-full blur-[120px] opacity-30" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                <SignedOut>
                    <div className="flex justify-center">
                        <SignIn 
                            routing='path' 
                            path='/sign-in'
                            appearance={{
                                elements: {
                                    card: "bg-glass-bg backdrop-blur-md border border-glass-border shadow-glass rounded-2xl",
                                    headerTitle: "text-text-primary",
                                    headerSubtitle: "text-text-secondary",
                                    socialButtonsBlockButton: "bg-bg-tertiary border-glass-border text-text-primary hover:bg-bg-secondary",
                                    formFieldLabel: "text-text-secondary",
                                    formFieldInput: "bg-bg-tertiary border-glass-border text-text-primary focus:border-accent-primary",
                                    footerActionLink: "text-accent-primary hover:text-accent-secondary",
                                    formButtonPrimary: "bg-accent-primary hover:bg-accent-primary/80 text-white shadow-glow"
                                }
                            }}
                        />
                        <SignUp 
                            routing='path' 
                            path='/sign-up'
                            appearance={{
                                elements: {
                                    card: "bg-glass-bg backdrop-blur-md border border-glass-border shadow-glass rounded-2xl",
                                    headerTitle: "text-text-primary",
                                    headerSubtitle: "text-text-secondary",
                                    socialButtonsBlockButton: "bg-bg-tertiary border-glass-border text-text-primary hover:bg-bg-secondary",
                                    formFieldLabel: "text-text-secondary",
                                    formFieldInput: "bg-bg-tertiary border-glass-border text-text-primary focus:border-accent-primary",
                                    footerActionLink: "text-accent-primary hover:text-accent-secondary",
                                    formButtonPrimary: "bg-accent-primary hover:bg-accent-primary/80 text-white shadow-glow"
                                }
                            }}
                        />
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className='glass-panel p-8 rounded-2xl text-center space-y-4'>
                        <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                        <p className="text-text-secondary">You are already signed in.</p>
                    </div>
                </SignedIn>
            </motion.div>
        </div>
    )
}