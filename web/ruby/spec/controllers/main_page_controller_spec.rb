require 'rails_helper'

RSpec.describe MainPageController, :type => :controller do
  describe 'index actions tests' do
    it 'has a 200 status code | get' do
      get :index
      expect(response.status).to eq(200)
    end

    it 'has a 200 status code too | post' do
      post :index
      expect(response.status).to eq(200)
    end

    it 'return result file after custom' do
        post :index, {"predefinedScript"=>"builder.CreateFile(\"docx\");\r\nvar oDocument = Api.GetDocument();\r\nvar oParagraph, oRun;\r\noParagraph = oDocument.GetElement(0);\r\noParagraph = Api.CreateParagraph();\r\noParagraph.AddText(\"Dear John Smith.\");\r\noDocument.Push(oParagraph);\r\noParagraph = Api.CreateParagraph();\r\noParagraph.AddText(\"ONLYOFFICE is glad to announce that starting today, you are appointed Commercial director to the company of your dream.\");\r\noDocument.Push(oParagraph);\r\noParagraph = Api.CreateParagraph();\r\noRun = Api.CreateRun();\r\noRun.SetBold(true);\r\noRun.AddText(\"Please note: \");\r\noParagraph.AddElement(oRun);\r\noRun = Api.CreateRun();\r\noRun.AddText(\"this text is used to demonstrate the possibilities of \");\r\noParagraph.AddElement(oRun);\r\noRun = Api.CreateRun();\r\noRun.SetBold(true);\r\noRun.AddText(\"ONLYOFFICE Document Builder\");\r\noParagraph.AddElement(oRun);\r\noRun = Api.CreateRun();\r\noRun.AddText(\" and cannot be used as real appointment to the position in any real company.\");\r\noParagraph.AddElement(oRun);\r\noDocument.Push(oParagraph);\r\noParagraph = Api.CreateParagraph();\r\noParagraph.AddText(\"Best regards,\");\r\noParagraph.AddLineBreak();\r\noParagraph.AddText(\"ONLYOFFICE Document Builder Team\");\r\noDocument.Push(oParagraph);\r\nbuilder.SaveFile(\"docx\", \"SampleText.docx\");\r\nbuilder.CloseFile();"}
        expect(response.header['Content-Disposition']).to eq('attachment; filename="ExampleFile.docx"')
    end

    it 'try to return result file with uncorrect params' do
      post :index, {"predefinedScript"=>"\r\nvar oDocument = Api.GetDocument();\r\nvar oParagraph, oRun;\r\noParagraph = oDocument.GetElement(0);\r\noParagraph = Api.CreateParagraph();\r\noParagraph.AddText(\"Dear John Smith.\");\r\noDocument.Push(oParagraph);\r\noParagraph = Api.CreateParagraph();\r\noParagraph.AddText(\"ONLYOFFICE is glad to announce that starting today, you are appointed Commercial director to the company of your dream.\");\r\noDocument.Push(oParagraph);\r\noParagraph = Api.CreateParagraph();\r\noRun = Api.CreateRun();\r\noRun.SetBold(true);\r\noRun.AddText(\"Please note: \");\r\noParagraph.AddElement(oRun);\r\noRun = Api.CreateRun();\r\noRun.AddText(\"this text is used to demonstrate the possibilities of \");\r\noParagraph.AddElement(oRun);\r\noRun = Api.CreateRun();\r\noRun.SetBold(true);\r\noRun.AddText(\"ONLYOFFICE Document Builder\");\r\noParagraph.AddElement(oRun);\r\noRun = Api.CreateRun();\r\noRun.AddText(\" and cannot be used as real appointment to the position in any real company.\");\r\noParagraph.AddElement(oRun);\r\noDocument.Push(oParagraph);\r\noParagraph = Api.CreateParagraph();\r\noParagraph.AddText(\"Best regards,\");\r\noParagraph.AddLineBreak();\r\noParagraph.AddText(\"ONLYOFFICE Document Builder Team\");\r\noDocument.Push(oParagraph);\r\nbuilder.SaveFile(\"docx\", \"SampleText.docx\");\r\nbuilder.CloseFile();"}
      expect(response.header['Content-Disposition']).to be_nil
    end
  end

  describe 'upload_data actions tests' do
    it 'has a 200 status code | get' do
      get :upload_data
      expect(response.status).to eq(400)
    end

    it 'has a 200 status code too | post' do
      post :upload_data
      expect(response.status).to eq(400)
    end

    it 'try to return result file with correct params | status check' do
      post :upload_data, {"commit"=>"docx", "input_name"=>"John Smith", "input_company"=>"ONLYOFFICE", "input_position"=>"Commercial director"}
      expect(response.status).to eq(200)
    end

    it 'try to return result file with correct params | file check' do
      post :upload_data, {"commit"=>"docx", "input_name"=>"John Smith", "input_company"=>"ONLYOFFICE", "input_position"=>"Commercial director"}
      expect(response.header['Content-Disposition']).to eq('attachment; filename="ExampleFile.docx"')
    end

    it 'try to return result file without correct params' do
      post :upload_data, {"commit"=>"docx", "input_company"=>"ONLYOFFICE", "input_position"=>"Commercial director"}
      expect(response.status).to eq(400)
      expect(response.header['Content-Disposition']).to be_nil
    end

    it 'try to return result file with empty commit params' do
      post :upload_data, {"commit"=>"", "input_name"=>"John Smith", "input_company"=>"ONLYOFFICE", "input_position"=>"Commercial director"}
      expect(response.status).to eq(400)
      expect(response.header['Content-Disposition']).to be_nil
    end

    it 'try to return result file with empty input_name params' do
      post :upload_data, {"commit"=>"docx", "input_name"=>"John Smith", "input_company"=>"ONLYOFFICE", "input_position"=>"Commercial director"}
      expect(response.status).to eq(200)
      expect(response.header['Content-Disposition']).to eq("attachment; filename=\"ExampleFile.docx\"")
    end

    %w(docx xlsx pdf).each do |current_format|
      it 'try to return result file with empty input_name params' do
        post :upload_data, {"commit"=>current_format, "input_name"=>"John Smith", "input_company"=>"ONLYOFFICE", "input_position"=>"Commercial director"}
        expect(response.status).to eq(200)
        expect(response.header['Content-Disposition']).to eq("attachment; filename=\"ExampleFile.#{current_format}\"")
      end
    end
  end
end