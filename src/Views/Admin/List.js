import React from 'react'
import Admin from "./Admin"
export default function List() {
    const markalar = [
        { value: 'Nike', label: 'Nike' },
        { value: 'Adidas', label: 'Adidas' },
        { value: 'Puma', label: 'Puma' },
        { value: 'Converse', label: 'Converse' },
        { value: 'Vans', label: 'Vans' },
        { value: 'New Balance', label: 'New Balance' },
        { value: 'Under Armour', label: 'Under Armour' },
        { value: 'Hummel', label: 'Hummel' },
    ]
    const cinsiyetler = [
        { value: 'Erkek', label: 'Erkek' },
        { value: 'Kadın', label: 'Kadın' },
        { value: 'Çocuk', label: 'Çocuk' },
    ]
    const renkler = [
        { value: 'Kırmızı', label: 'Kırmızı' },
        { value: 'Mavi', label: 'Mavi' },
        { value: 'Siyah', label: 'Siyah' },
        { value: 'Beyaz', label: 'Beyaz' },
        { value: 'Turuncu', label: 'Turuncu' },
        { value: 'Pembe', label: 'Pembe' },
        { value: 'Mor', label: 'Mor' },
        { value: 'Yeşil', label: 'Yeşil' }
    ]
    const UrunTurleri = [
        { value: 'Bot', label: 'Bot' },
        { value: 'Spor Ayakkabı', label: 'Spor Ayakkabı' },
        { value: 'Günlük Ayakkabı', label: 'Günlük Ayakkabı' },
        { value: 'Sandalet', label: 'Sandalet' },
        { value: 'Babet', label: 'Babet' },
        { value: 'Topuklu Ayakkabı', label: 'Topuklu Ayakkabı' },
        { value: 'Çizme', label: 'Çizme' },
    ]
    const kargolar = [
        { value: 'Ücretsiz', label: 'Ücretsiz' },
        { value: 'Ücretli', label: 'Ücretli' },
    ]
    const numaralar = [
        { value: '28', label: '28' },
        { value: '29', label: '29' },
        { value: '30', label: '30' },
        { value: '31', label: '31' },
        { value: '32', label: '32' },
        { value: '33', label: '33' },
        { value: '34', label: '34' },
        { value: '35', label: '35' },
        { value: '36', label: '36' },
        { value: '36.5', label: '36.5' },
        { value: '37', label: '37' },
        { value: '37.5', label: '37.5' },
        { value: '38', label: '38' },
        { value: '38.5', label: '38.5' },
        { value: '39', label: '39' },
        { value: '40', label: '40' },
        { value: '41', label: '41' },
        { value: '42', label: '42' },
        { value: '42.5', label: '42.5' },
        { value: '43', label: '43' },
    ]
    return (
        <>
        <Admin numaralar={numaralar} kargolar={kargolar} UrunTurleri={UrunTurleri} renkler={renkler} cinsiyetler={cinsiyetler} markalar={markalar} />
        </>
        )
    
}
