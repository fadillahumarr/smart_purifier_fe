type PurifierResponse = {
    id: string;
    user_id: string;
    name: string;
    location: string | null;
    mac_address: string | null;
    device_code: string;
    mqtt_topic_base: string;
    firmware_version: string | null;
    created_at: string;
    updated_at: string;
};

export type { PurifierResponse };