import mongoose from 'mongoose'
import config from './app/config'
import app from './app'

async function main() {
    try {
        await mongoose.connect(config.database_url as string)
        app.listen(config.port, () => {
            console.log(
                `Server is listening on http://localhost:${config.port}`,
            )
        })
    } catch (error) {
        console.log(error)
    }
}

main()
