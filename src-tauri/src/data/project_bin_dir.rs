use serde::Serialize;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Folder {
    pub display_name: String,
    pub contained_folders: Vec<String>,
    pub contained_sources: Vec<String>,
}

pub type Directory = Mutex<HashMap<String, Folder>>;

#[inline]
pub fn root_dir_str() -> String {
    return "root".to_string();
}

#[inline]
pub fn default_folder() -> Folder {
    return Folder {
        display_name: "New Folder".to_string(),
        contained_folders: Vec::new(),
        contained_sources: Vec::new(),
    };
}

pub fn init_state(man: &AppHandle) {
    let dir_map = HashMap::from([(root_dir_str(), default_folder())]);
    let directory: Directory = Mutex::new(dir_map);
    man.manage(directory);
}
