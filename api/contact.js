import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value = ''){
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export default async function handler(req, res){

    if(req.method !== 'POST'){
        return res.status(405).json({
            error:'Method Not Allowed'
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

        if(
            !email ||
            !subject ||
            !message
        ){
            return res.status(400).json({
                error:'Missing required fields'
            });
        }

        const data = await resend.emails.send({

            from:'EnviroValor Website <noreply@envirovalor.com>',

            to:'info@envirovalor.com',

            reply_to: email,

            subject:'EnviroValor 網站新詢問',

            html:`
                <h2>網站新詢問</h2>

                <p><strong>詢問項目：</strong>${escapeHtml(inquiryType)}</p>

                <p><strong>公司：</strong>${escapeHtml(company)}</p>

                <p><strong>Email：</strong>${escapeHtml(email)}</p>

                <p><strong>主旨：</strong>${escapeHtml(subject)}</p>

                <p><strong>留言：</strong></p>
                <p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>
            `
        });

        if(data.error){
            return res.status(500).json({
                success:false,
                error:data.error
            });
        }
        

        return res.status(200).json({
            success:true,
            data
        });

    }catch(error){

        console.error("Resend error:", error);
    
        return res.status(500).json({
            success:false,
            error:error.message || 'Email sending failed'
        });
    }
}