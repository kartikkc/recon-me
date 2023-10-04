<!-- <img aling="center" src="https://imgur.com/AO4B9WL.png" /> -->
<img align="center" src="./Logo/recon-me-poster.png"/>

# R3C0N-M3: Authentication API 
Your Gateway to Secure Access


## Features
- Signup Using Email and generation of JWT token.
- Login
- Getting User details using JWT token.
- Verifing User using OTP on corresponding email.
- Authentication using Google.

## Endpoints

### Sign-up

### Sending the User Details 

```js
POST https://recon-me.vercel.app/createuser/
```

#### Body :

| Parameter  | Type     | Description                                |
| :--------- | :------- | :------------------------------------------|
| `email`    | `string` | **Required** Email Address                 |
| `name`     | `string` | **Required** Name                          |
| `password` | `string` | **Required** Password                      |

#### Usage

javascript:

```javascript
const createNewUser = await fetch(`https://recon-me.vercel.app/createuser/`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name:credentials.name ,email: credentials.email, password: credentials.password})
});
const json = await createNewUser.json();
console.log(json);
```

#### Response

```javascript
{
  "status": "Success! User Created! Please Continue to Verify your Account",
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjUxZDZkNDc4N2RhMDcwMDA4MDM4YWQ4In0sImlhdCI6MTY5NjQyNzMzNX0.NMzkynrn7fmZuO1HBkOtBsaWIyzM0dq_MaB0Lft5WPA"
}
```

### Verfiying User


```js
POST https://recon-me.vercel.app/createuser/verify/
```

#### Body:


| Parameter  | Type     | Description                                |
| :--------- | :------- | :------------------------------------------|
| `otp`    | `Integer` | **Required** Email Address                  |

*setting the auth-token as a header to the request.

#### Usage

javascript:

```javascript
const verfiyNewUser = await fetch(`https://recon-me.vercel.app/createuser/verify`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({otp: otp.number});
});
const json = await verifyNewUser.json();
console.log(json);
```
