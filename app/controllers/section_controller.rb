class SectionController < ApplicationController

    def update
        section = Section.find(params[:id])
        section.update(
            title: params[:title],
            content: params[:content]
        )
        if section.valid? && section.save
            redirect_to admin_path
        end
    end
end
