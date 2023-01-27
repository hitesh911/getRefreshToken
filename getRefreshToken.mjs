const http = require('http')
const url = require("url")
// const authFile = require("./googleCred.json")
const querystring = require('querystring')
const axios = require('axios')
const path = require('path')
const process = require('process')
const fs = require('fs').promises

async function getRefreshToken(Authorizationcode,client_id,client_secret,redirect_uri) {
    // Prepare the request body
    const data = querystring.stringify({
        code: Authorizationcode,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    });
   try {
        const response = await axios.post('https://oauth2.googleapis.com/token', data);
        return response.data
    } catch (error) {
        console.error(error);
        return null
    }
}

async function generateRefreshToken(authCred,token_path){
	token_path = path.join(process.cwd(), token_path+"/tokens.json");
	const scope = 'https://www.googleapis.com/auth/drive';
	const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
    `client_id=${authCred.client_id}&` +
    `redirect_uri=${authCred.redirect_uris[0]}&` +
    `scope=${scope}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;
    console.log(`Open this url on Browser:\n\t ${authUrl}`)
    const redirectUrl = url.parse(authCred.redirect_uris[0])
    const server = http.createServer(async (req,res)=>{
    	const reqUrl = url.parse(req.url)
    	if(reqUrl.pathname == redirectUrl.pathname){
    		const authorization_code = reqUrl.search.split("code=")[1].split("&scope")[0]
    		const tokens = await getRefreshToken(authorization_code,authCred.client_id,authCred.client_secret,authCred.redirect_uris[0])
    		if(tokens != null){
    			const tokens_data = JSON.stringify({
    				access_token : tokens.access_token,
    				expires_at: Date.now() + tokens.expires_in *1000,
    				refresh_token: tokens.refresh_token,
    				scope: tokens.scope,
    				token_type: tokens.token_type,
    				client_id: authCred.client_id,
    				client_secret: authCred.client_secret
    			}) 
    			await fs.writeFile(token_path,tokens_data)
    			console.log(`\nSuccessfully created tokens.json at ${token_path}`)
    		}else{
    			console.log('Tokens are not generated due to above error. Try again !')
    		}
    		res.write("Your have successfully authrized assess to application please go back")
    		res.end()
    		console.log('Please press ctrl+c to terminate this server')
    		
    	}else{
    		res.write("your redirect_uris does not match please re-check")
    		res.end()
    	}
    })
    try {
    	await server.listen(redirectUrl.port)
    } catch(e) {
    	await server.listen(8787)
    	console.log('Can not listen on port specified in redirect_uris due to error :',e);
    }
    
	
}

// generateRefreshToken(authFile.web,".")
module.exports = {
	generateRefreshToken
}


