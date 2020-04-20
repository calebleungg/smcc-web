class MemberAreaController < ApplicationController

    def index
        @members = User.all
        @posts = MemberPost.all.order("created_at DESC")
    end

    def create_post
        user = current_user
        user.member_posts.create(message: params[:message])
        if user.save && user.valid?
            redirect_back(fallback_location: member_index_path)
        end
    end

end
