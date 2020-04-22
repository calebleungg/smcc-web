class MemberAreaController < ApplicationController

    def index
        @members = User.all
        @albums = Album.all
        @posts = MemberPost.where(announcement: false).order("created_at DESC").limit(20)
        @events = Event.all.order("created_at ASC")
        @announcements = MemberPost.where(announcement: true).order("created_at DESC")
    end

    def create_post
        user = current_user
        if params[:announcement]
            user.member_posts.create(message: params[:message], announcement: true )
        else
            user.member_posts.create(message: params[:message], announcement: false )
        end

        if user.save && user.valid?
            redirect_back(fallback_location: member_index_path)
        end
    end

    def create_reply
        user = current_user
        post = MemberPost.find(params[:post_id])
        post.post_replies.create(message: params[:message], user_id: user.id)
        if post.save && post.valid?
            redirect_back(fallback_location: member_index_path)
        end
    end

    def create_event
        event = Event.create(
            name: params[:name],
            about: params[:about],
            location: params[:location],
            date: params[:date]
        )
        if event.save && event.valid?
            redirect_back(fallback_location: member_index_path)
        end
    end

    def delete_post
        post = MemberPost.find(params[:id])
        replies = post.post_replies
        replies.destroy_all
        post.destroy
        redirect_back(fallback_location: member_index_path)
    end

    def remove_announc
        if current_user.admin
            post = MemberPost.find(params[:id])
            post.announcement = false
            if post.save && post.valid?
                redirect_back(fallback_location: member_index_path)
            end
        end
    end

end
