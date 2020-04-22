Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/", to: "user#index", as: "root"

  get "/admin", to: "admin#manager", as: "admin"

  get "/albums/show/:id", to: "album#show", as: "album"

  post "/album/create", to: "album#create", as: "create_album"
  post "/album/:id/photo/add", to: "photo#add", as: "add_photo"

  patch "/section/update", to: "section#update", as: "update_section"
  patch "/album/:id/update/public", to: "album#update_public", as: "update_public"
  patch "/album/:id/update/private", to: "album#update_private", as: "update_private"

  get "/member-request/new", to: "request#new", as: "new_request"
  get "/member-request/confirmation", to: "request#confirm", as: "confirm_request"
  post "/member-request/create", to: "request#create", as: "create_request"
  post "/member-request/:id/approve", to: "admin#approve", as: "approve_request"
  delete "/member-request/decline/:id", to: "admin#decline", as: "decline_request"

  patch "/photo/:id/move-up", to: "photo#move_up", as: "move_up"
  patch "/photo/:id/move-down", to: "photo#move_down", as: "move_down"
  delete "/photo/:id/delete", to: "photo#delete", as:"delete_photo"

  get "/contact/new", to: "contact#new", as: "new_contact"

  get "/members", to: "member_area#index", as: "member_index"
  post "/members/create_post", to: "member_area#create_post", as:"create_member_post"
  post "/members/create_reply", to: "member_area#create_reply", as:"create_post_reply"
  post "/members/create_event", to: "member_area#create_event", as:"create_event"

  patch "/members/remove_announc/:id", to: "member_area#remove_announc", as:"remove_announc"
  delete "/members/delete_post/:id", to: "member_area#delete_post", as:"delete_post"


end
