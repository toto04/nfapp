import { AsyncStorage } from "react-native"

export interface Note {
    id: number,
    images: string[],
    author: string,
    title: string,
    description: string,
    postingdate: string,
    points: number,
    vote?: boolean
}

export let isSaved: (note: Note) => Promise<boolean> = async (note) => {
    let allKeys = await AsyncStorage.getAllKeys()
    let keys = allKeys.filter(k => k.match(/note\d+/))
    return keys.some(v => keys.map(k => parseInt(k.match(/note(\d+)/)[1])).includes(note.id))
}

export let saveNote: (note: Note) => Promise<void> = async (note) => {
    await AsyncStorage.setItem('note' + note.id, JSON.stringify(note))
}

export let removeNote: (note: Note) => Promise<void> = async (note) => {
    try {
        await AsyncStorage.removeItem('note' + note.id)
    } catch (e) { console.error(e) }
}