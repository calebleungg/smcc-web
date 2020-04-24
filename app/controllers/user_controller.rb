class UserController < ApplicationController

    def index
        @albums = Album.where(public: true)
        @history = Section.find(1)
        @purpose = Section.find(2)
    end

    def show
        @user = User.find(params[:id])
    end

    def edit
        user = current_user
        user.update(
            first_name: params[:first_name],
            last_name: params[:last_name],
            email: params[:email],
            phone: params[:phone],
            country: params[:country],
            address: params[:address],
            year_grad: params[:year_grad]
        )

        if user.valid? && user.save
            redirect_to user_path(user)
        end
    end

    def upload_avatar
        user = current_user
        user.avatar.attach(params[:user][:image])
        if user.save
            redirect_back(fallback_location: user_path(user.id))
        end
    end
    
end
