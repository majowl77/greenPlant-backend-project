import 'dotenv/config';

export const dev={
    app:{port:Number(process.env.PORT)|| 3003},
    db:{
        url:
        process.env.MONGODB_URL||'mongodb:localhost:3003/backend_project'
    },
}
