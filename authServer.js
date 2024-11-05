
//Endpoint för att logga in 

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    const csrfToken = generateCsrfToken()

   
res.json({csrfToken})

})
