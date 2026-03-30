import { Supabase } from './script.js';

const {data: topic, error: topics_error} = await Supabase
.from('topics')
.select('image_name')

if (topics_error) 
{
    console.error("Error loading topics ", topics_error);
}


const bucket = Supabase.storage.from('style images');
const discord_icon = bucket.getPublicUrl('discord_icon.png');
const gmail_icon = bucket.getPublicUrl('gmail_icon.png');
document.getElementById('discord_icon').src = discord_icon.data.publicUrl;
document.getElementById('gmail_icon').src = gmail_icon.data.publicUrl;

const img_name = topic.image_name;
const img_url = bucket.getPublicUrl(img_name).data.publicUrl;