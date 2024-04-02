import { MaxWidthWrapper } from "./MaxWidthWrapper.component";
import Link from 'next/link'
import {LoginLink, RegisterLink,getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server';
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav.component";
export default async function NavBar() {
  const {getUser} = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="sticky inset-x-0 top-0 h-14 w-full z-30 border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper className="h-full">
        <div className="flex items-center justify-between border-b border-zinc-200 h-full">
          <Link href={'/'} className="flex font-semibold z-40 text-xl sm:text-2xl">
            <span>Unveil.</span>
          </Link>
          {/* TODO: Add navBar for mobo */}
          <div className="hidden sm:flex items-center space-x-4">
           {!user ? (
              <>
              <Link href={'/pricing'} className={buttonVariants({variant:'ghost',size:'sm'})}>Pricing</Link>
              <LoginLink className={buttonVariants({variant:'ghost',size:'sm'})}>Sign in</LoginLink>
              <RegisterLink className={buttonVariants({size:'sm'})}>
                Get started
                <ArrowRight className="ml-1.5 w-5 h-5"/> 
              </RegisterLink>
            </>
           ) : (<>
              <Link href={'/admin'} className={buttonVariants({variant:'ghost',size:'sm'})}>Dashboard</Link>
              <UserAccountNav name={(!user.given_name && !user.family_name) ? 'Your Account' : `${user.given_name} ${user.family_name}`} email={user.email ?? ''} imageURL={user.picture ?? ''}/>
           </>)}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
