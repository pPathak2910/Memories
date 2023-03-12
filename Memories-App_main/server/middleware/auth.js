import jwt from 'jsonwebtoken';

// User wants to like a post
// Click the like button => auth middleware (NEXT) => like controller
// google auth coming soon

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; // google auth token has length > 500
        
        let decodedData;

        if(token && isCustomAuth){ // own token
            decodedData = jwt.verify(token, process.env.SECRET_KEY)

            req.userId = decodedData?.id;
        }else{ // google auth
            decodedData = jwt.decode(token); // no secret reqd

            req.userId = decodedData?.sub // sub is google's way of id, sub uniquely identifies user
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;