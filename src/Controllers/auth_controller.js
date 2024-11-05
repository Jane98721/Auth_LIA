// Logik för registrering, inloggning och tokenhantering

const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')

let users = []  //Temporärt. Byt ut mot databas
let refreshTokens = [] //Temporär

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword}
        users.push(user)
        res.status(201).json({message: "User registered"})
    } catch {
        res.status(500).json({error: "Error"})
    }
}

const loginUser = async (req, res) => {
    const user= users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).json({ message: 'Cannot find user'})
    }
    try {
       if(await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET)

        refreshTokens.push(refreshToken)

        res.cookie ('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15*60*1000,
            sameSite: 'Lax'
        })
        
        
        res.cookie ('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7*24*60*60*1000,
            path: '/refresh',
            sameSite:'Lax'
        })

        res.json({message: 'Login successful'})
       } else {
        res.status(403).json({ message: 'Invalid credentials'})
       }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error logging in"})
    }

}

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken || !refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    
    const newAccessToken = jwt.sign({name: user.name}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15*60*1000,
        sameSite: 'Lax'
    })

    res.json ({message: 'Token refreshed'})
    })
}

const logoutUser = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
        refreshTokens = refreshTokens.filter(token => token !== refreshToken)
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.sendStatus(204)
    } else {
    res.sendStatus(204)
}
}

module.exports = {registerUser, loginUser, refreshToken, logoutUser}
