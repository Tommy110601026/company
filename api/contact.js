import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;

const rateLimitStore = new Map();

const FIELD_LIMITS = {
    inquiryType: 100,
    company: 100,
    email: 254,
    subject: 150,
    message: 3000
};

function escapeHtml(value = ''){
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function normalizeText(value = ''){
    return String(value).trim();
}

function isValidEmail(email = ''){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isOverLimit(value = '', limit){
    return String(value).length > limit;
}

function getClientIp(req){
    const forwardedFor =
        req.headers['x-forwarded-for'];

    if(forwardedFor){
        return forwardedFor.split(',')[0].trim();
    }

    return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip){
    const now =
        Date.now();

    const record =
        rateLimitStore.get(ip);

    if(!record){
        rateLimitStore.set(ip, {
            count: 1,
            startTime: now
        });

        return false;
    }

    const elapsedTime =
        now - record.startTime;

    if(elapsedTime > RATE_LIMIT_WINDOW_MS){
        rateLimitStore.set(ip, {
            count: 1,
            startTime: now
        });

        return false;
    }

    record.count += 1;

    if(record.count > RATE_LIMIT_MAX_REQUESTS){
        return true;
    }

    return false;
}

export default async function handler(req, res){

    if(req.method !== 'POST'){
        return res.status(405).json({
            success: false,
            error: 'Method Not Allowed'
        });
    }
    const clientIp =
    getClientIp(req);

    if(isRateLimited(clientIp)){
        return res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again later.'
        });
    }

    try{

        const {
            inquiryType = '',
            company = '',
            email = '',
            subject = '',
            message = ''
        } = req.body || {};

        const normalizedInquiryType =
            normalizeText(inquiryType);

        const normalizedCompany =
            normalizeText(company);

        const normalizedEmail =
            normalizeText(email);

        const normalizedSubject =
            normalizeText(subject);

        const normalizedMessage =
            normalizeText(message);

        if(
            !normalizedEmail ||
            !normalizedSubject ||
            !normalizedMessage
        ){
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        if(!isValidEmail(normalizedEmail)){
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        if(
            isOverLimit(normalizedInquiryType, FIELD_LIMITS.inquiryType) ||
            isOverLimit(normalizedCompany, FIELD_LIMITS.company) ||
            isOverLimit(normalizedEmail, FIELD_LIMITS.email) ||
            isOverLimit(normalizedSubject, FIELD_LIMITS.subject) ||
            isOverLimit(normalizedMessage, FIELD_LIMITS.message)
        ){
            return res.status(400).json({
                success: false,
                error: 'Input content is too long'
            });
        }

        const data = await resend.emails.send({

            from: 'EnviroValor Website <noreply@envirovalor.com>',

            to: 'info@envirovalor.com',

            reply_to: normalizedEmail,

            subject: 'EnviroValor 網站新詢問',

            html: `
                <h2>網站新詢問</h2>

                <p><strong>詢問項目：</strong>${escapeHtml(normalizedInquiryType)}</p>

                <p><strong>公司：</strong>${escapeHtml(normalizedCompany)}</p>

                <p><strong>Email：</strong>${escapeHtml(normalizedEmail)}</p>

                <p><strong>主旨：</strong>${escapeHtml(normalizedSubject)}</p>

                <p><strong>留言：</strong></p>
                <p>${escapeHtml(normalizedMessage).replaceAll('\n', '<br>')}</p>
            `
        });

        if(data.error){
            return res.status(500).json({
                success: false,
                error: data.error
            });
        }

        return res.status(200).json({
            success: true,
            data
        });

    }catch(error){

        console.error('Resend error:', error);

        return res.status(500).json({
            success: false,
            error: error.message || 'Email sending failed'
        });
    }
}