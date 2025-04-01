export async function GET() {
    return Response.json({ success: true, message: 'Hello from Vapi' }, {
        status: 200,
    })
}
