
import { supabase } from "@/integrations/supabase/client";
import { Vocabulary } from "@/types/vocabulary";

export const fetchAllVocabulary = async (): Promise<Vocabulary[]> => {
    let allVocabulary: Vocabulary[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('vocabulary')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error('Error fetching vocabulary:', error);
            throw error;
        }

        if (data) {
            // Cast the data to Vocabulary[] carefully, assuming the DB schema matches the type
            // We might need to handle potential mismatches if types are strict
            allVocabulary = [...allVocabulary, ...data as unknown as Vocabulary[]];

            if (data.length < pageSize) {
                hasMore = false;
            } else {
                page++;
            }
        } else {
            hasMore = false;
        }
    }

    return allVocabulary;
};
