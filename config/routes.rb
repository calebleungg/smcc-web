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

end
