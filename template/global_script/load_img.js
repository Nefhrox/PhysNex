import { Supabase } from '../global_script/script.js';


const bucket = Supabase.storage.from('structure_img');

const discord_icon = bucket.getPublicUrl('discord_icon.png');
const gmail_icon = bucket.getPublicUrl('gmail_icon.png');


document.getElementById('discord_icon').src = discord_icon.data.publicUrl;
document.getElementById('gmail_icon').src = gmail_icon.data.publicUrl;
