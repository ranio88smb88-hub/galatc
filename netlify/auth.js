exports.handler = async (event, context) => {
    // Untuk autentikasi tambahan jika diperlukan
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Auth function' })
    };
};
