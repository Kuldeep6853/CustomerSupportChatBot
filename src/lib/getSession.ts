import { cookies } from "next/headers";
import { scalekit } from "./scalekit";

type TokenPayload={
    sub:string
}
export async function getSession() {
    const session=await cookies()
    const token=session.get("access_token")?.value
    if(!token){
        return null
    }
    try {
        const result:TokenPayload=await scalekit.validateToken(token)
        const user=await scalekit.user.getUser(result.sub)
        return user
    } catch (error) {
        console.log(error)
    }
}