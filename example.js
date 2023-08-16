const URL = 'http://localhost:3000';

(async () => {
    const status = await fetch(URL + '/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'John Doe',
            email: 'jdoe@test.com',
            password: 'Password123'
        })
    }).then(res => res.status);
    console.log('Registration status:', status);

    const { token } = await fetch(URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'jdoe@test.com',
            password: 'Password123'
        })
    }).then(res => res.json());
    console.log('Token:', token);

    const user = await fetch(URL + '/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());
    console.log('User:', user);

    const updatedUser = await fetch(URL + '/user', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'Jane Doe'
        })
    }).then(res => res.json());
    console.log('Updated user:', updatedUser);

    const { success } = await fetch(URL + '/user', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());
    console.log('Delete success:', success);
})();