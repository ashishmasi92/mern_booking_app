



declare global{
    namespace Express{
        interface Request{
            userInfo:{
                id:string;
                email:string;
                iat:number;
                exp:number;
            }
        }
    }
}

export {}