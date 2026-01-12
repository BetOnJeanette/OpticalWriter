use tauri::{State, AppHandle, Manager, Runtime};
use uuid::Uuid;

use crate::data::project_bin_dir::{default_folder, root_dir_str, Directory};

pub fn add_folder<R: Runtime>(app_handle: AppHandle<R>, selected_dir_id: String){
    let cur_dir_state:State<Directory> = app_handle.state::<Directory>();
    let parent_dir_id = get_safe_parent_dir_id(&selected_dir_id, &cur_dir_state);
    let new_id = Uuid::new_v4().to_string();
    let new_fold = default_folder();
    cur_dir_state.lock().unwrap().insert(new_id.clone(), new_fold);
    let mut container  = cur_dir_state.lock().unwrap().get(&parent_dir_id).unwrap().clone();
    container.contained_folders.push(new_id);
    cur_dir_state.lock().unwrap().insert(parent_dir_id, container);
}

fn get_safe_parent_dir_id(desired_id: &String, cur_dir_state: &State<Directory>) -> String {
    if cur_dir_state.lock().unwrap().contains_key(desired_id) {
        return desired_id.to_string();
    } else  {
        return root_dir_str();
    }
}
