use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, Runtime, State};
use uuid::Uuid;

use crate::data::project_bin_dir::{default_folder, root_dir_str, Directory, Folder};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct NewFolder {
    new_folder: Folder,
    id: String,
    parent_id: String,
}

#[tauri::command]
pub fn add_folder<R: Runtime>(app_handle: AppHandle<R>, selected_folder_id: String) {
    let cur_dir_state: State<Directory> = app_handle.state::<Directory>();
    let parent_dir_id = get_safe_parent_dir_id(&selected_folder_id, &cur_dir_state);
    let new_id = Uuid::new_v4().to_string();
    let new_fold = default_folder();
    cur_dir_state
        .lock()
        .unwrap()
        .insert(new_id.clone(), new_fold.clone());
    let mut container = cur_dir_state
        .lock()
        .unwrap()
        .get(&parent_dir_id)
        .unwrap()
        .clone();
    container.contained_folders.push(new_id.clone());
    cur_dir_state
        .lock()
        .unwrap()
        .insert(parent_dir_id.clone(), container);
    let emitted_obj = NewFolder {
        new_folder: new_fold,
        id: new_id,
        parent_id: parent_dir_id,
    };
    let _ = app_handle.emit("folder-added", emitted_obj);
}

fn get_safe_parent_dir_id(desired_id: &String, cur_dir_state: &State<Directory>) -> String {
    if cur_dir_state.lock().unwrap().contains_key(desired_id) {
        return desired_id.to_string();
    } else {
        return root_dir_str();
    }
}
