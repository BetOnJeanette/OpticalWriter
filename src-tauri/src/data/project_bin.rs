use serde::Serialize;
use tauri::{AppHandle, Manager};
use std::collections::HashMap;
use std::sync::Mutex;

#[derive(Clone, Serialize)]
#[serde(rename_all="camelCase")]
pub struct FileData {
    pub path: String,
    pub display_name: String,
}

pub type ProjectBinData = Mutex<HashMap<String, FileData>>;

#[inline]
fn get_init_state() -> ProjectBinData {
    return  Mutex::new(HashMap::new());
}

pub fn init_state(man: &AppHandle){
    man.manage(get_init_state());
}
