import { ApiLog } from '../modules/v1/hr/models/api-log-model';

class ApiLogger {
  

    createLog(req, res, next) {
        try {

            let logData = {};
            const startTime = new Date(); // Record the start time

            res.on('finish', async () => {
                const endTime = new Date(); // Record the end time
                const processTime = endTime - startTime; // Calculate process time in milliseconds


                logData = {
                    request_user_agent: req.headers['user-agent'],
                    request_host: req.headers['origin'] || req.headers.host,
                    method: req.method,
                    request_url: req.originalUrl,
                    type: res.statusCode !== 200 ? 2 : 1,
                    status_code: res.statusCode,
                    status_message: res.statusMessage,
                    content_length: `${res.get('Content-Length') || 0} bytes`,
                    requested_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                    remote_address: req.connection.remoteAddress,
                    request_ip: req.ip,
                    process_time: `${processTime} ${unitCalculation(processTime)}`,
                };

                //store logs
                ApiLog.create(logData)
                console.log(logData)
            });
            next();
        } catch (err) {
            console.error('Error creating logs:', err.message);
            next();
        }
    }
}



export default new ApiLogger();


const unitCalculation = (processTime) => {

    let unit = 'ms';

    // Convert to seconds if processTime is >= 1000 milliseconds
    if (processTime >= 1000) {
        if (processTime >= 60 * 60 * 1000) {
            // Convert to hours
            processTime /= 60 * 60 * 1000;
            unit = 'hrs';
        } else if (processTime >= 60 * 1000) {
            // Convert to minutes
            processTime /= 60 * 1000;
            unit = 'min';
        } else {
            // Convert to seconds
            processTime /= 1000;
            unit = 's';
        }
    }

    return unit
}