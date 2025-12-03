import jwt from 'jsonwebtoken'

const gentoken = async (userID) => { 
    try {
        const token = await jwt.sign({userID}, process.env.JWT_TOKEN, {expiresIn : '7d'})
    } catch (err) {
        console.log(err);
    }
}


export default gentoken 